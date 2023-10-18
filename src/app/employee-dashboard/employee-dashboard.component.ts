import { Component ,OnInit} from '@angular/core';
import {FormBuilder , FormGroup,Validators} from '@angular/forms'
import {ApiService} from  '../shared/api.service'

import { Employeemodel } from './employee-dash board.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})


export class EmployeeDashboardComponent implements OnInit{

formValue !:FormGroup;
employeeModelObj : Employeemodel=new Employeemodel();// creation of the employee modelobject of EmployeeModel type
employeeData !: any;  //creation of employeeData to store the getting  values from the getrequest
showAdd !:boolean;
showUpdate !:boolean;

constructor(private formbuilder :FormBuilder
    ,private api :ApiService){}

  ngOnInit(): void {
    
    this.formValue=this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@gmail\.com$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      salary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    })
    this.getAppEmployee();
  }

  clickAddEmployee(){
    this.formValue.reset();
    this.showAdd=true;
    this.showUpdate=false;  
  } 
  //function to submit the form after clicking the enter button in the  keyboard
  submitForm() {
    if (this.formValue.invalid) {
      this.formValue.markAllAsTouched();
      return;
    }
  }
  

  
  postEmployeeDetails(){

    if (this.formValue.invalid){
      this.formValue.markAllAsTouched(); // Mark all form controls as touched to trigger validation errors
    return;
    }else{
    this.employeeModelObj.firstName =this.formValue.value.firstName;
    this.employeeModelObj.lastName=this.formValue.value.lastName;
    this.employeeModelObj.email=this.formValue.value.email;
    this.employeeModelObj.mobile=this.formValue.value.mobile;
    this.employeeModelObj.salary=this.formValue.value.salary;


    this.api.postEmployee(this.employeeModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("Employee Added Sucessfully");
      let ref=document.getElementById('cancel');
      ref?.click();   ///to close the Model after clicking the add button  
      this.formValue.reset(); //to reset the form after entering the values
      this.getAppEmployee();  //to get the latest added emloyee records
    },
    err=>{
      alert('Something Went Wrong ')
    })
  }
}
getAppEmployee(){
  this.api.getEmployee()
  .subscribe(res=>{
    this.employeeData=res;
  })
}

deleteEmployee(row :any){
  this.api.deleteEmployee(row.id)
  .subscribe(res=>{
    alert('Employee Deleted Sucessfully');
    this.getAppEmployee();
  })
}

onEdit(row :any){
  this.showAdd=false;
  this.showUpdate=true;

this.employeeModelObj.id=row.id;  //to store the id of which we clicked
this.formValue.controls['firstName'].setValue(row.firstName);
this.formValue.controls['lastName'].setValue(row.lastName);
this.formValue.controls['email'].setValue(row.email);
this.formValue.controls['mobile'].setValue(row.mobile);
this.formValue.controls['salary'].setValue(row.salary);
}

updateEmployeeDetails(){
  this.employeeModelObj.firstName =this.formValue.value.firstName;
  this.employeeModelObj.lastName=this.formValue.value.lastName;
  this.employeeModelObj.email=this.formValue.value.email;
  this.employeeModelObj.mobile=this.formValue.value.mobile;
  this.employeeModelObj.salary=this.formValue.value.salary;

  this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id)
  .subscribe(res=>{
    alert("Details Updated Sucessfylly");
    let ref=document.getElementById('cancel');
    ref?.click();
    this.formValue.reset(); //to reset the form after entering the values
    this.getAppEmployee(); 
  })
}
}

