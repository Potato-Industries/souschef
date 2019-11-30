# souschef
CyberChef (Node-API) encryption / decryption / encoding / decoding (+ more) recipe tool
- https://gchq.github.io/CyberChef/
- https://github.com/gchq/CyberChef/wiki/Node-API

> CyberChef is really cool! It allows you to rapidly template encryption/decryption/encoding/decoding routines trivially. This is a very simple application that brings CyberChef's capabilities to your shell allowing you to pipe via Stdin/Stdout to other applications. This is especially useful if you don't feel like writing any encryption code from scratch, which was one of the reasons why i wrote this, a similar tool most probably exists somewhere on the internet, oh well. 

Try hooking it up with..
http://www.dest-unreach.org/socat/

**Requirements**

```
apt-get install nodejs
apt-get install npm
npm install --save cyberchef

```

**Usage**

> stdin | souschef | stdout

```
root@WOPR-KALI:/opt/souschef# nodejs souschef.js -h
souschef.js [command]

Commands:
  souschef.js socket-rotate  socket encrypt (send), decrypt (recv) CyberChef
                             recipe mode (rotates encryption method)
  souschef.js socket-basic   socket encrypt (send), decrypt (recv) CyberChef
                             recipe mode
  souschef.js core           stdin to stdout encrypt/decrypt recipe mode

Options:
  --version   Show version number                                      [boolean]
  --help, -h  Show help                                                [boolean]

root@WOPR-KALI:/opt/souschef# nodejs souschef.js core -h
souschef.js core

stdin to stdout encrypt/decrypt recipe mode

Options:
  --version     Show version number                                    [boolean]
  --help, -h    Show help                                              [boolean]
  --recipe, -r  file path to encryptor/decryptor CyberChef recipe (.json)
                                                                        [string]
  --mode, -v    verbose mode on

```
**Recipe Setup**

Craft a recipe.json file according to whatever encryption/decryption/encoding/decoding/etc operations (aka 'CyberChef Recipe') you want. Use https://gchq.github.io/CyberChef/ to draft and export your recipe as compact json.  


**AES Encrypt -> Base64 Encode**

```
root@WOPR-KALI:/opt/souschef# echo "POTATO" | nodejs souschef.js core -r /opt/souschef/AESe-recipe.json
YmUxNGEwMDc2ODI5MTlkNzljNmVmYWYwOGY1ZTE0MjE=

```

**AESe-recipe.json**

```
[{"op":"AES Encrypt","args":[{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"CBC","Raw","Hex"]},{"op":"To Base64","args":["A-Za-z0-9+/="]}]
```

**Base64 Decode -> AES Decrypt**

```
echo "YmUxNGEwMDc2ODI5MTlkNzljNmVmYWYwOGY1ZTE0MjE=" | nodejs souschef.js core -r /opt/souschef/AESd-recipe.json
POTATO
```
**AESd-recipe.json**
```
[{"op":"From Base64","args":["A-Za-z0-9+/=",true]},{"op":"AES Decrypt","args":[{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"CBC","Hex","Raw",{"option":"Hex","string":""}]}]
```

**Verbose**

```
root@WOPR-KALI:/opt/souschef# echo "POTATO" | nodejs souschef.js core -r /opt/souschef/AESe-recipe.json -v
stdin: 
POTATO

recipe: 
[ { op: 'AES Encrypt',
    args: [ [Object], [Object], 'CBC', 'Raw', 'Hex' ] },
  { op: 'To Base64', args: [ 'A-Za-z0-9+/=' ] } ]

stdout: 
YmUxNGEwMDc2ODI5MTlkNzljNmVmYWYwOGY1ZTE0MjE=
```

**Work in progress**

- Socket-Basic: Encrypt (send)/ Decrypt (recv) tcp socket mode.
- Socket-Rotate: Obfuscation mode, rotate between a predefined list of encryption routines (most probably per message).  

**Disclaimer**

Use at your own risk. 

Enjoy~
