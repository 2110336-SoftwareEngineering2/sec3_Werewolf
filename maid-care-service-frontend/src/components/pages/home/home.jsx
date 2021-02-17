import React from "react";
import userStore from "../../../MobX/User";



const Home = () => {
    return(<div>
        Hello {userStore.userData.firstname}
    </div>)
}

export default Home;
