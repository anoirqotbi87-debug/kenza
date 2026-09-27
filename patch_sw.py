with open('src/app/sw.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('declare const self: ServiceWorkerGlobalScope;', 'declare const self: any;')
content = content.replace('handler: "NetworkOnly",', 'handler: "NetworkOnly" as any,')
content = content.replace('handler: "CacheFirst",', 'handler: "CacheFirst" as any,')

with open('src/app/sw.ts', 'w', encoding='utf-8') as f:
    f.write(content)
