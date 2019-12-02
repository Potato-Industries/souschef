# souschef

stdin | souschef (run through CyberChef Recipe) | stdout

- https://gchq.github.io/CyberChef/
- https://github.com/gchq/CyberChef/wiki/Node-API

> CyberChef is really cool! It allows you to rapidly template encryption/decryption/encoding/decoding/+more routines. This is a very simple application that brings CyberChef's capabilities to your shell allowing you to pipe via stdin/stdout to other applications. This is especially useful if you don't feel like writing any encryption code from scratch, which was one of the reasons why i wrote this, a similar tool most probably exists somewhere on the internet, oh well. 


**Requirements**

```
apt-get install nodejs
apt-get install npm
npm install --save cyberchef
npm install --save yargs

```

**Usage**

> stdin | souschef | stdout

```
root@WOPR-KALI:/opt/souschef# nodejs souschef.js -h
souschef.js [command]

Commands:
  souschef.js socket  stdin | souschef <-- TCP --> ip:port
  souschef.js core    stdin | souschef | stdout

Options:
  --version   Show version number                                      [boolean]
  --help, -h  Show help  
```

```
root@WOPR-KALI:/opt/souschef# nodejs souschef.js core -h
souschef.js core

stdin | souschef | stdout

Options:
  --version     Show version number                                    [boolean]
  --help, -h    Show help                                              [boolean]
  --recipe, -r  file path to recipe .json                               [string]
  --mode, -v    verbose on

```

```
root@WOPR-KALI:/opt/souschef# nodejs souschef.js socket -h
souschef.js socket

stdin | souschef <-- TCP --> ip:port

Options:
  --version   Show version number                                      [boolean]
  --help, -h  Show help                                                [boolean]
  --ip        destination ip or domain                                  [string]
  --port      destination port                                          [string]
  --out       file path to outbound recipe .json                        [string]
  --in        file path to inbound recipe .json                         [string]
  --mode, -v  verbose on

```

**Recipe Creation**

- Craft a recipe.json file using https://gchq.github.io/CyberChef/ to draft your CyberChef recipe, export it in Compact JSON format.

- For simpler tasks use one of the pre-created recipes included in the 'recipes' folder. Some recipes will require modification as they are populated by default values. (e.g. encryption keys)


**Generate Hashes**

```
root@WOPR-KALI:/opt/souschef# echo "potato" | nodejs souschef.js core -r recipes/hashing/generate-all-hashes.json 
MD2:          49669308a06eedc83bc713d6c42d2f00
MD4:          72ac36b4ea9dd1f9251539c31d9658e8
MD5:          e561f9248d7563d15dd93457b02ebbb6
MD6:          058b6d7cee765b08fd01486299ad88e9c05ee3c847b1d738eacd5225f7d1abcc
SHA0:         6461bf8177fc5cf39bddc20c4fb4e89ca5fe8b81
SHA1:         cefda9e2be1f21d11cdd9452f5b7f97fda977f42
SHA2 224:     d3d33e5635ba972e6b8c9323564dd24a18ed741e7c902312fa303b35
```
**Analyse Hash**

```
root@WOPR-KALI:/opt/souschef# echo "e561f9248d7563d15dd93457b02ebbb6" | nodejs souschef.js core -r recipes/hashing/analyse.json
Hash length: 32
Byte length: 16
Bit length:  128

Based on the length, this hash could have been generated by one of the following hashing functions:
MD5
MD4
MD2
HAVAL-128
RIPEMD-128
Snefru
Tiger-128
```

**Disassemble x86/x86_64**

https://www.exploit-db.com/shellcodes/47513

```
WOPR@WOPR souschef % echo "\x99\xf7\xe2\x8d\x08\xbe\x2f\x2f\x73\x68\xbf\x2f\x62\x69\x6e\x51\x56\x57\x8d\x1c\x24\xb0\x0b\xcd\x80" | node souschef.js core -r recipes/shellcode/disass-x86.json
00000000 99                              CDQ
00000001 F7E2                            MUL EAX,EDX
00000003 8D08                            LEA ECX,[EAX]
00000005 BE2F2F7368                      MOV ESI,68732F2F
0000000A BF2F62696E                      MOV EDI,6E69622F
0000000F 51                              PUSH ECX
00000010 56                              PUSH ESI
00000011 57                              PUSH EDI
00000012 8D1C24                          LEA EBX,[ESP]
00000015 B00B                            MOV AL,0B
00000017 CD80                            INT 80
```

**Blowfish Encrypt | Blowfish Decrypt**

```
root@WOPR-KALI:/opt/souschef# echo "potato" | nodejs souschef.js core -r recipes/encrypt/blowfish-cbc.json | nodejs souschef.js core -r recipes/decrypt/blowfish-cbc.json 
potato

```

**AES Encrypt; Base64 Encode | Base64 Decode; AES Decrypt**

```
root@WOPR-KALI:/opt/souschef# echo "potato" | nodejs souschef.js core -r recipes/custom/AESe-recipe.json | nodejs souschef.js core -r recipes/custom/AESd-recipe.json 
potato

```

**AESe-recipe.json**

```
[{"op":"AES Encrypt","args":[{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"CBC","Raw","Hex"]},{"op":"To Base64","args":["A-Za-z0-9+/="]}]
```

**AESd-recipe.json**
```
[{"op":"From Base64","args":["A-Za-z0-9+/=",true]},{"op":"AES Decrypt","args":[{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},{"option":"Hex","string":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"CBC","Hex","Raw",{"option":"Hex","string":""}]}]
```

**Socket mode**
```
root@WOPR-KALI:/opt/souschef# socat STDIO STDIO | nodejs souschef.js socket --ip 127.0.0.1 --port 8080 --out recipes/encode/base64.json --in recipes/empty.json
potato
potarto
^C

root@WOPR-KALI:~# nc -lvp 8080
listening on [any] 8080 ...
connect to [127.0.0.1] from localhost [127.0.0.1] 41542
cG90YXRvCg==potarto
^C

```

**stdin | souschef | socat**

http://www.dest-unreach.org/socat/

```
root@WOPR-KALI:/opt/souschef# echo "potato" | nodejs souschef.js core -r recipes/encode/base64.json | socat - tcp-connect:localhost:8080
root@WOPR-KALI:/opt/souschef# echo "potato" | nodejs souschef.js core -r recipes/encode/base64.json > potato.b64
root@WOPR-KALI:/opt/souschef# md5sum potato.b64 
1021506e38119e37d5df7255b8a207bb  potato.b64

root@WOPR-KALI:/var/tmp# nc -lnp 8080 > potato.b64
root@WOPR-KALI:/var/tmp# md5sum potato.b64 
1021506e38119e37d5df7255b8a207bb  potato.b64

```
**Tar, Untar**

```
WOPR@WOPR souschef % echo "hello" | node souschef.js core -r recipes/compression/tar.json > test.tar
WOPR@WOPR souschef % file test.tar 
test.tar: POSIX tar archive
WOPR@WOPR souschef % cat test.tar | node souschef.js core -r recipes/compression/untar.json          
hello%                                          
```

**Verbose mode**

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

- Provide ability to chain multiple recipes files in command line. 
- Provide ability to update common variables in recipe files from command line. (i.e. key, iv, secrets)

**Disclaimer**

Use at your own risk. 

Enjoy~
