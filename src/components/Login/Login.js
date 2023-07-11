import React, { useState ,useEffect ,useReducer} from 'react';
 
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state,action) =>{
  if(action.type === "USER_INPUT"){
   return {value:action.val,isValid:action.val.includes('@')} 
  }
  if(action.type === "INPUT_BLUR"){
    return {value:state.value,isValid:state.value.includes('@')}
  }
  return {value:'',isValid:null};
}

const passwordReducer = (state,action) =>{
  if(action.type === "USER_INPUT"){
    return {value:action.val,isValid:action.val.length > 6};
  }
  if(action.type === "INPUT_BLUR"){
    return {value:state.value,isValid:state.value.length > 6}
  }

  return {value:'',isValid:null}

}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState,dispatchEmail] = useReducer(emailReducer,{value:'',isValid: null});
  const [passwordState,dispatchPassword] = useReducer(passwordReducer,{value:'',isValid:null});

  const {isValid : emailIsValid} = emailState;
  const {isValid : passwordIsValid} = passwordState;

  useEffect(()=>{

    const identifier = setTimeout(()=>{
      console.log("Check validating !!");
      setFormIsValid(
        emailState.isValid && passwordState.isValid
      );
    },500);

    // clean up 은 처음 사이드 이펙트가 실행될땐 타지 않고 이후에 이 이펙트가 실행되면 실행되기전에 clean up 실행 됨.
    return ()=>{
      clearTimeout(identifier);
      console.log("clean up");
    }
  },[emailIsValid,passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type:"USER_INPUT",val:event.target.value});
    setFormIsValid(
      event.target.value.includes('@')  && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type:"USER_INPUT",val:event.target.value});
    
    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type:"INPUT_BLUR"})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:"INPUT_BLUR"})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value , passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid  === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
