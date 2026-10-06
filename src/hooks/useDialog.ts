import { useEffect, useRef, RefObject } from 'react';

export function useDialog(isOpen: boolean, onClose: () => void): { dialogRef: RefObject<HTMLDivElement | null> } {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // `onClose` est presque toujours une lambda inline, donc d'identité nouvelle à chaque rendu.
  // En dépendre directement relancerait l'effet à chaque rendu, ce qui remettrait le focus sur
  // le premier élément interactif en boucle — l'utilisateur ne pourrait plus tabuler.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const dialogNode = dialogRef.current;
      if (dialogNode) {
        // Find focusable elements
        const focusableElements = dialogNode.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (firstElement) {
          firstElement.focus();
        } else {
          dialogNode.focus();
        }

        const handleTab = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement || document.activeElement === dialogNode) {
                e.preventDefault();
                lastElement?.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
              }
            }
          }
        };

        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onCloseRef.current();
          }
        };

        dialogNode.addEventListener('keydown', handleTab);
        document.addEventListener('keydown', handleEscape);

        return () => {
          dialogNode.removeEventListener('keydown', handleTab);
          document.removeEventListener('keydown', handleEscape);
        };
      }
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isOpen]);

  return { dialogRef };
}
