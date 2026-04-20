git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env frontend/.env.local backend/serviceAccountKey.json" --prune-empty --tag-name-filter cat -- --all
