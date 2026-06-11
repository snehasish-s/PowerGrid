@echo off
setlocal enabledelayedexpansion
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "!MAVEN_PROJECTBASEDIR:~-1!"=="\" set "MAVEN_PROJECTBASEDIR=!MAVEN_PROJECTBASEDIR:~0,-1!"
set "MAVEN_WRAPPER_JAR=!MAVEN_PROJECTBASEDIR!\.mvn\wrapper\maven-wrapper.jar"
if defined JAVA_HOME (
  set "JAVACMD=%JAVA_HOME%\bin\java"
) else (
  set "JAVACMD=java"
)
"%JAVACMD%" -Dmaven.multiModuleProjectDirectory="!MAVEN_PROJECTBASEDIR!" -cp "!MAVEN_WRAPPER_JAR!" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal