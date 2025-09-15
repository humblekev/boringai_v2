#!/usr/bin/env python3
"""
Setup script for BoringAI Backend
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a shell command and return result"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running: {command}")
        print(f"Error: {e.stderr}")
        return False

def main():
    """Setup the backend environment"""
    print("🚀 Setting up BoringAI Backend...")

    # Check if Python 3.8+ is available
    python_version = sys.version_info
    if python_version.major < 3 or python_version.minor < 8:
        print("❌ Python 3.8+ is required")
        sys.exit(1)

    print(f"✅ Python {python_version.major}.{python_version.minor} detected")

    # Create virtual environment
    print("\n📦 Creating virtual environment...")
    if not run_command("python3 -m venv venv"):
        print("❌ Failed to create virtual environment")
        sys.exit(1)

    # Activate virtual environment and install requirements
    print("\n📋 Installing dependencies...")
    activate_cmd = "source venv/bin/activate" if os.name != 'nt' else "venv\\Scripts\\activate"
    install_cmd = f"{activate_cmd} && pip install -r requirements.txt"

    if not run_command(install_cmd):
        print("❌ Failed to install dependencies")
        sys.exit(1)

    print("\n✅ Setup complete!")
    print("\n🎯 To start the backend:")
    print("1. cd backend")
    print("2. source venv/bin/activate  (or venv\\Scripts\\activate on Windows)")
    print("3. python main.py")
    print("\n🌐 The API will be available at: http://localhost:8000")

if __name__ == "__main__":
    main()