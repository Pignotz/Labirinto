@echo off
setlocal enabledelayedexpansion

echo ▶ Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo ▶ Copying frontend into backend...
rmdir /s /q backend\src\main\resources\static
mkdir backend\src\main\resources\static
xcopy frontend\dist backend\src\main\resources\static /E /I /Y

echo ▶ Building backend JAR...
cd backend
call mvn clean package -DskipTests
cd ..

for %%f in (backend\target\*.jar) do set JAR=%%f

echo ▶ Starting packaged application...
java -jar %JAR%
pause
