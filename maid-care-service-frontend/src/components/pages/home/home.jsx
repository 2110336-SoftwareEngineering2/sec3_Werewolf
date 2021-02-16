import React from "react";
import userStore from "../../../MobX/User";
import {Link} from "@chakra-ui/react";


const Home = () => {
    return(<div>
        Hello {userStore.userData.firstname}
    </div>)
}

export default Home;
