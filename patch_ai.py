with open('src/components/dialogue/AiRoleplayView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add Supabase import if not present
if "import { supabase }" not in content:
    content = content.replace("import { v4 as uuidv4 } from 'uuid';", "import { v4 as uuidv4 } from 'uuid';\nimport { supabase } from '@/lib/supabase';")
if "import PaywallModal from" not in content:
    content = content.replace("import { supabase } from '@/lib/supabase';", "import { supabase } from '@/lib/supabase';\nimport PaywallModal from '@/components/monetization/PaywallModal';")

# Add token state and paywall state
state_block = """
  const [token, setToken] = useState<string>('');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
      }
    });
  }, []);
"""
content = re.sub(r'(const parseAiMessage = .*?\n)(.*?)export default function AiRoleplayView\(\{ personaId, onClose \}: AiRoleplayViewProps\) \{\n', r'\1\2export default function AiRoleplayView({ personaId, onClose }: AiRoleplayViewProps) {\n' + state_block, content, flags=re.DOTALL)

# Update useChat
usechat_block = """
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, error } = useChat({
    api: '/api/roleplay/chat',
    body: { personaId },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    onError: (err) => {
      if (err.message.includes('QUOTA_EXCEEDED') || err.message.includes('403')) {
        setShowPaywall(true);
      }
    }
  });
"""
content = re.sub(r'  const \{ messages, input, handleInputChange, handleSubmit, isLoading, setMessages \} = useChat\(\{.*?\}\);', usechat_block, content, flags=re.DOTALL)

# Handle Paywall modal UI at the end
paywall_ui = """
      {showPaywall && <PaywallModal source="ai_roleplay_quota" onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
"""
content = content.replace("    </div>\n  );\n}", paywall_ui)

with open('src/components/dialogue/AiRoleplayView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
