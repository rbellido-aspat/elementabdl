# Avisa a IndexNow (Bing, Yandex, Seznam, Naver y otros) las páginas que cambiaron entre dos commits.
# Uso: python indexnow.py <commit_anterior> <commit_nuevo>
# En GitHub Actions corre después del deploy a Azure. En local: python .github/scripts/indexnow.py HEAD~1 HEAD
import json, subprocess, sys, urllib.error, urllib.request

HOST = 'www.elementabdl.cl'
KEY = '9cea577b5e0b47bdbc2533cc91a22837'

def main(before, after):
    if not before or set(before) == {'0'}:
        print('Sin commit anterior, no se avisa nada.'); return 0
    out = subprocess.run(['git', 'diff', '--name-only', '--no-renames', before, after], capture_output=True, text=True, check=True).stdout
    urls = []
    for f in out.splitlines():
        if f.startswith('.github/') or not f.endswith('.html') or f == '404.html': continue
        path = '/' + (f[:-len('index.html')] if f.endswith('index.html') else f)
        urls.append(f'https://{HOST}{path}')
    if not urls:
        print('No cambió ninguna página.'); return 0
    body = json.dumps({'host': HOST, 'key': KEY, 'keyLocation': f'https://{HOST}/{KEY}.txt', 'urlList': urls[:10000]}).encode()
    req = urllib.request.Request('https://api.indexnow.org/indexnow', data=body, headers={'Content-Type': 'application/json; charset=utf-8'})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f'IndexNow respondió {r.status} con {len(urls)} URL:'); print('\n'.join(urls)); return 0
    except urllib.error.HTTPError as e:
        print(f'IndexNow respondió {e.code}: {e.read().decode(errors="replace")}'); return 1

if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else '', sys.argv[2] if len(sys.argv) > 2 else 'HEAD'))
