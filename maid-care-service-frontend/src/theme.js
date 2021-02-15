import {extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    colors:{
        boxWhite:"#F7FAFC",
        brandGreen:"#48BB78", //logo, menu bar
        buttonGreen:"#38A169",
        buttonGrey:'#F0F1F2',
        Grey400:'A0AEC0', //filled text, button
        Grey300:'CBD5E0', //sample text
        Grey555:'555555', //logo, header
        //inputFill: white
        inputBorder:'E2E8F0',
        screenBG:'#EDF2F7',
    },
    fonts:{
        body:"Arial, sans serif",
        //Grab:'Grab Community EN v2.0',
    },
});

export default theme;