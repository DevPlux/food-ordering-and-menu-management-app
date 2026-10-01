# Start dev server

npx expo start

# Start with cache cleared

npx expo start --clear

# Start with tunnel

npx expo start --tunnel

# Install an Expo-managed package

npx expo install <package>

# Install a plain npm package

npm install <package>

# Check project health

npx expo-doctor

# List dependencies

npm list --depth=0

# Check outdated packages

npm outdated

# Type check

npx tsc --noEmit

# Full clean reinstall (Git Bash / PowerShell)

rm -rf node_modules package-lock.json
npm install

# Full clean reinstall (Windows CMD)

rmdir /s /q node_modules
del package-lock.json
npm install
