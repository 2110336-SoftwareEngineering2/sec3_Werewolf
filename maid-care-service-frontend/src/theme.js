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
    space: {
        px: "1px",
        0: "0",
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
});

export default theme;