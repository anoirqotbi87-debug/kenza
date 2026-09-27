import re

with open('src/components/profile/ProfileView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import NotificationSettings from './NotificationSettings';", "import NotificationSettings from './NotificationSettings';\nimport PlacementTestModal from '../onboarding/PlacementTestModal';\nimport { Zap } from 'lucide-react';")

content = content.replace("const { xp, streakDays, srsDeck } = useAppStore();", "const { xp, streakDays, srsDeck } = useAppStore();\n  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);")

replacement = """        <div className="mt-8">
          <NotificationSettings />
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Test de Positionnement</h3>
              <p className="text-sm text-slate-500">Réévaluez votre niveau pour débloquer du contenu.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPlacementTestOpen(true)}
            className="w-full py-3 px-4 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl font-bold transition-colors"
          >
            Re-passer le test
          </button>
        </div>

        <PlacementTestModal 
          isOpen={isPlacementTestOpen} 
          onClose={() => setIsPlacementTestOpen(false)} 
          onComplete={(lvl) => {
            setIsPlacementTestOpen(false);
          }} 
        />"""

# Replace exactly this part:
#         {/* Notifications & Reminders */}
#         <div className="mt-8">
#           <NotificationSettings />
#         </div>

pattern = re.compile(r'<\!\-\- Notifications & Reminders \-\->.*?<div className="mt-8">.*?<NotificationSettings />.*?</div>', re.DOTALL)
if '<NotificationSettings />' in content:
    # Simpler replace
    content = content.replace('<div className="mt-8">\n        <NotificationSettings />\n        </div>', replacement)
    content = content.replace('<div className="mt-8">\n          <NotificationSettings />\n        </div>', replacement)
    
with open('src/components/profile/ProfileView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
