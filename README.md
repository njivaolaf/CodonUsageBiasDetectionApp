# Codon Usage Bias Detection (Web Application)
Codon usage bias is a difference in frequency of synonymous codon in a DNA. We have 64 different codons and 20 translated amino acids thus this abundance allow some acids to be coded by several codons. Thus, the DNA is said to be corrupted due to such redundancy. Thus, an unexpected greater frequency of one codon will be observed.
Several systems have been designed to analyse the codon usage bias of DNA sequences. We have observed that these do have limits in the characters (500,000 max). CUB Detection web application has thus been designed to establish the frequency of codons in a DNA and to address this issue. The limit has been pushed to <b>one billion characters</b> and can be be further improved. 

## I. Features
* Upload text file (containing raw sequence)
    * e.g: atgtttcagaaagaggatcttgctacatggatgcaaatttcaatgag
    
* Graph output [Thanks to ngx-charts](https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical)

*	Inclusion of multi-user capabilities(different roles)
    *	Admin, Backend, Normal User
    *	Email confirmation
    *	Block account functionality
    
*	Minimum of restriction to size of data to be processed

## II. How it works?
![alt text](https://ucarecdn.com/4213dcd5-ab5c-4c17-8300-64d133a77aba/)

Graph Output:
![alt text](https://ucarecdn.com/74114221-13bb-4cae-a06c-998aca5998fd/)
## III. Prerequisites
These are the minimum prerequisites needed to run the app:
* Latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
Please refer to [this documentation](https://nodejs.org/docs/latest-v7.x/api/) in case you want to learn about node.
* Angular-cli. As npm has been installed, we can now install the cli by using the command (CMD/PowerShell): 
  
```
  npm install -g @angular/cli@latest
```
* Visual Studio Code can be downloaded [here](https://code.visualstudio.com/Download)
* pgAdmin (for our database ). Link [here](https://www.pgadmin.org/download/) . We can choose the latest version. 

## IV. Run the project

### Database setup
- create a new database "<b>cubdetection</b>" in pgAdmin.
- set the password to <b>mypassword</b> (in case you want to chose another password, please reflect the changes in API<server<datasources.json and replace "mypassword" with your respective password.
- Open each folder (ADMIN and API) into Visual Studio Code or any other code editor.

### ADMIN folder
```
  npm install
```
- we will see a node-modules folder appearing in the ADMIN.
- In admin/src/environments, we will notice the apiUrl, e.g:
  - 'http://localhost:3013' (to take note) , we can change this port into any other free port but same needs to be updated 
  in api<server<config.json .
    ```
      ng serve
    ```
    (this will take approximately 4 minutes depending on your PC, you can still carry on to the next task)
### API folder
``` 
npm install
```
  - same as in ADMIN previously, node-modules folder now present in the API folder.
``` 
node .
```

### Now ..let us open our browser
Url: 'http://localhost:4200'
We can now use these credentials to login as ADMIN 
```
  EMAIL: admin@admin.com   PASSWORD: password
```
or browse the app as Guest.

<b>Updates coming soon...</b>
