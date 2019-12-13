## Build Instructions

Disclaimer: These instructions are written by a noob, but it worked to get Grin++ with UI working on Ubuntu 18.04.  Please use at your discretion and edit for other OS's and needs.

### Linux
#### Prerequisites
* git
* build-essential
* uuid-dev
* GrinPlusPlus (the node/wallet)

We will be building both GrinPlusPlus and the UI, if you already have GrinPlusPlus built you make have to piecemeal this or build again.
**Command Line**
1. ```sudo apt install uuid-dev npm build-essential git```
2. ```cd ~```
3. ```git clone https://github.com/GrinPlusPlus/GrinPlusPlus.git```
4. ```git clone https://github.com/GrinPlusPlus/GrinPlusPlusUI.git```
5. ```cd GrinPlusPlus```
6. ```mkdir build```
7. ```cd build```
8. ```cmake ..```
9. ```cmake --build```
10. ```Go run the node and let it sync...```
11. ```GrinPlusPlus/bin/<Configuration>. You're looking for GrinNode```
12. I dont think this step matters, but you might as well run GrinNode and let it fully synchronize before moving to the next step
13. Edit the command to be the appropriate folder where you found GrinNode in step 11 ```cp -R ~/GrinPlusPlus/bin/<Configuration>/ ~/GrinPlusPlusUI/```
14. ```cd ~GrinPlusPlusUI/```
15. ```npm install```
16. ```npm start```

Note that step 16 requires that you already have GrinNode running.  You can run it from the ~/GrinPlusPlusUI/ folder, since you copied it there.  There is a way to set the UI to autostart the node, but it works best for me to just start the node and then run npm start within the ~/GrinPlusPlusUI/
