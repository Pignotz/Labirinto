@echo off
setlocal enabledelayedexpansion

echo ===============================
echo  BUILD FRONTEND
echo ===============================
cd frontend
call npm install
call npm run build
if errorlevel 1 goto error
cd ..

echo ===============================
echo  COPY FRONTEND -> BACKEND
echo ===============================
rmdir /s /q backend\src\main\resources\static
mkdir backend\src\main\resources\static
xcopy frontend\dist backend\src\main\resources\static /E /I /Y

echo ===============================
echo  BUILD BACKEND (MAVEN WRAPPER)
echo ===============================
cd backend
call mvnw.cmd clean package -DskipTests
if errorlevel 1 goto error
cd ..

echo ===============================
echo  LOCATE JAR
echo ===============================
set JAR=
for %%f in (backend\target\*.jar) do (
    set JAR=%%f
    goto found
)

:found
if "%JAR%"=="" (
    echo ERROR: JAR not found!
    goto error
)

echo ===============================
echo  START APPLICATION
echo ===============================
echo Using JAR: %JAR%
start http://localhost:8080
java -jar "%JAR%"
goto end

:error
echo.
echo ❌ BUILD FAILED
pause
exit /b 1

:end
pause
