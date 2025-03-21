class UserController {
  constructor(formIdCreate, formIdUpdate, tableId) {
    this.formEl = document.getElementById(formIdCreate);
    this.formUpdateEl = document.getElementById(formIdUpdate);
    this.tableEl = document.getElementById(tableId);

    this.onEdit();
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (event) => {
      event.preventDefault();

    let btn =  this.formEl.querySelector('[type=submit]');

   // btn.disabled = true;
      
      let values = this.getValues(this.formEl);

      if(!values) return false;

      this.getPhoto().then((content)=>
      {
        values.photo = content;
        this.addLine(values)

        this.formEl.reset();

        btn.disabled = false;
      }, 
      (e)=>
      {
        console.error(e);
      }
    );
   

   
    });
  }

  onEdit(){
    document.querySelector("#box-user-update .btn-cancel").addEventListener("click", (e)=>{
      
      this.showPanelCreate();

    })

    this.formUpdateEl.addEventListener("submit", e=>{

      e.preventDefault();

      let btn = this.formUpdateEl.querySelector("[type=submit]");

      btn.disabled = true;

      let value = this.getValues(this.formUpdateEl);


      let index = this.formUpdateEl.dataset.trIndex;

      this.tableEl.rows[index].dataset.user = JSON.stringify(value);



      

    })
  }

  getPhoto(){

    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      let elements = [...this.formEl.elements].filter(item =>{
         if(item.name === 'photo'){
           return item;
         }
       })
   
       let file = elements[0].files[0];
       
       fileReader.onload = ()=> {
   
         resolve(fileReader.result);
   
       };
       fileReader.onerror = (e)=>{
        reject(e);
       }
       if(file){
        fileReader.readAsDataURL(file);
       }else{
        resolve('dist/img/boxed-bg.jpg');
       }
    });
    
  }

  getValues(formEl) {
    let user = {};
    let isValid = true;

    [...formEl.elements].forEach((field, index) => {

      if(['name', 'email', 'password'].indexOf(field.name)> -1 && !field.value ){

        field.parentElement.classList.add('has-error');
        isValid = false;

      }



      if (field.name == "gender") {
        if (field.checked) {
          user[field.name] = field.value;
        }
      } else if(field.name == "admin"){
        user[field.name] = field.checked;
      }
        else {
        user[field.name] = field.value;
      }

    });

    if(!isValid){

      return false;
   
      
    }

    return new User(
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }

  addLine(dataUser) {

    let tr = document.createElement('tr');

    tr.dataset.user = JSON.stringify(dataUser); 


    tr.innerHTML = ` 
    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
    <td>${dataUser.name}</td>
    <td>${dataUser.email}</td>
    <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
    <td>${Utils.dateFormat(dataUser.register)}</td>
    <td>
      <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
    </td>`;

    tr.querySelector(".btn-edit").addEventListener("click", e=>{
      let json = JSON.parse(tr.dataset.user);
      let form = document.querySelector('#form-user-update');

      form.dataset.trIndex = tr.sectionRowIndex;

      for(let name in json){
       let field = form.querySelector('[name= ' + name.replace("_", "") + "]"); 

   
       
       if(field){
        if(field.type=='file') continue;

        switch(field.type){
          case 'file':
          continue;
          break;

          case 'radio':
            field = form.querySelector('[name= ' + name.replace("_", "") + "][value="+json[name]+"]"); 
            field.checked = true;
          break;

          case 'checkbox':
            field.checked = json[name];
          break;

          default:
            field.value = json[name];
            

        }
        field.value = json[name];
       }
      }
        this.showPanelUpdate();
    });


  this.tableEl.appendChild(tr);
  this.formEl.reset();

  this.updateCount();


  

  }

  showPanelCreate(){
    document.querySelector(".box-success").style.display = 'block';
    document.querySelector('.box-primary').style.display = 'none'
  }
  showPanelUpdate(){
    document.querySelector(".box-success").style.display = 'none';
    document.querySelector('.box-primary').style.display = 'block';
  }

  updateCount(){
    let numberUsers = 0;
    let numberAdmin = 0;
   [...this.tableEl.children].forEach(tr=>{

    numberUsers++;
    let user =  JSON.parse(tr.dataset.user);

    if(user._admin) numberAdmin++;

   });

   document.querySelector("#number-users").innerHTML = numberUsers;
   document.querySelector("#number-users-admin").innerHTML = numberAdmin;
  }
}
