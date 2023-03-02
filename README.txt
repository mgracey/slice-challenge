The 4 files that make up the core functionality of pizzabot are located in pizzabot/bin folder

Required: To install pizzabot command, node and npm are required

---------------------------------------------------

MAIN METHOD:  
[Created on/for windows, but also tested in linux]

>Extract contents of tar file
>cd into pizzabot directory
>run 'npm install -g .'  [**] 
	
>can now run pizzabot commands from command line in any directory
	>> pizzabot 5x5 "(0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)"    [***]
	>> pizzabot -d 5x5 "(0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)"
	>> pizzabot test

>to uninstall: npm uninstall -g pizzabot


[**]  >> 'sudo npm install -g .' may be required on linux, Run as Administrator on windows
[***] >> "" around coordinates required in linux but optional in windows

---------------------------------------------------

BACK UP METHOD:
[If work case scenario, the above doesn't work, below steps should work on both linux and windows]

>extract contents of tar file 
>cd into pizzabot/bin directory
>run commands manually by replacing pizzabot with "node pizzabot"
	>> node pizzabot 5x5 "(0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)"
	>> node pizzabot -d 5x5 "(0, 0) (1, 3) (4, 4) (4, 2) (4, 2) (0, 1) (3, 2) (2, 3) (4, 1)"
	>> node pizzabot test

--------------------------------------------------

