set fish_greeting
starship init fish | source

abbr --add gc git checkout
abbr --add gc. git checkout .
abbr --add gcb git checkout -b

abbr --add gd git diff
abbr --add gs git status

abbr --add gb git branch
abbr --add gbd git branch -D

abbr --add ga git add
abbr --add ga. git add .

abbr --add gcm "git commit -m \""
abbr --add gca git commit --amend

abbr --add gacm "git add . && git commit -m \""

abbr --add gp git push
abbr --add gpf git push --force
# push new branch to remote
abbr --add gpuo git push -u origin

abbr --add gpull git pull
