import Hero from '../components/Hero';
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'

const HomeScreen = () => {
  return (
      <div className="row">
      <LoginScreen className="col-6" />
      <RegisterScreen className="col-6" />
      </div>
    )

};
export default HomeScreen;
