# ShopHub

## Git Regulation
- we are using github flow, you may search about that online, but in short, you should fork a branch from main, and do your coding there
- **NEVER EVER** do changes to main directly
- `rebase` will be used for merging 2 branchs, instead of `merge`, to keep all the commits
- please tell everyone if you want to merge your branch with main
  
## setup DBMS
- we are using [postgres](https://www.postgresql.org/download/)
- please set all password to `admin`  
- please set the DB server port as `5433`  
- to setup the tables, please login to psql with CLI, and run `\i {path of setup.sql}`, the `setup.sql` is in server folder
  
## setup server and client  
- first download node and npm in your computer
- go to each folder, and run `npm install`, and all the required modules will be installed