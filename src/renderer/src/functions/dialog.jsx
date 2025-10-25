import { faHourglassEnd, faPlaneSlash, faTrash, faUserShield } from "@fortawesome/free-solid-svg-icons";



  export const getDialogInfo = (operation, length, sub) => {
    let msg;
    let icon;
    let color = "red";
    if(operation == "Delete"){
        msg = `Are you sure you want to delete ${length} ${sub}?`
        icon = faTrash
    }else if(operation == "End"){
        msg = `Are you sure you want to end ${length} ${sub}?`
        icon = faHourglassEnd
        color = "purple"
    }else if(operation == 'User' || operation == 'Admin'){
        msg = `Are you sure you want to change the admin state of ${length} users?`
        icon = faUserShield
        color = "black";
    } else{
        msg = `Are you sure you want to cancel ${length} ${sub}?`
        icon = faPlaneSlash
    } 

     
    return {msg : msg, icon: icon, color}
  }