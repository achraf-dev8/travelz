export const checkInput = (name, input) =>{
    if(input != ''){
    if(name == 'name'){
      if(input.length < 3) return 'Name is too short'
    }else if(name == 'phoneNumber'){
      if(input.length<6) return 'Phone number is too short'
      const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
      if(!phoneRegex.test(input)) return 'Enter a valide phone number'
    }
    }
    return null
  }
