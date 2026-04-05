/** @type {import('tailwindcss').Config} */

const IS_SIIGO = process.env.VITE_COGNITO_CLIENT_ID;

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkmode: false,
  theme: {
    extend: {
      screens: {
        "custom-xl": "1536px",
        "custom-2xl": "1600px",
      },
      colors: {
        primary: IS_SIIGO ? "#009dff" : "#0070b3",
        primary_focus: "#0167A4",
        secondary: IS_SIIGO ? "#5B6B79" : "#474747",
        secondary_focus: "#3E3E3E",
        extra_dark: "#272727",
        extra_white: "#F7F7F7",
        extra_gray: "#868A91",
        extra_gray_focus: "#797A7D",
        extra_secondary_text: "#A6A6A6",
        sucess: "#54AF53",
        success_focus: "#459443",
        danger: "#CB3333",
        danger_focus: "#9D2727",
        info: "#4E7CA9",
        info_focus: "#3A638C",
        sg_primary: {
          50: "#E6F5FF",
          100: "#B8E3FF",
          200: "#8AD1FF",
          300: "#5CBFFF",
          400: "#2EAFFF",
          500: "#009DFF",
          600: "#027FD0",
          700: "#0362A1",
          800: "#034676",
          900: "#022A46",
        },
        sg_secondary: {
          50: "#FEFEFE",
          100: "#F8F9FA",
          200: "#ECEFF1",
          300: "#CFD8DC",
          400: "#B0BEC5",
          500: "#8996A4",
          600: "#5B6B79",
          700: "#3E4853",
          800: "#1D2630",
          900: "#131920",
        },
        sg_error: {
          50: "#F5BEBE",
          100: "#E76767",
          200: "#DC2626",
          300: "#D31C1C",
          400: "#C50D0D",
        },
        sg_warning: {
          50: "#F7DCB3",
          100: "#EDAD4D",
          200: "#E58A00",
          300: "#DE7700",
          400: "#D35A00",
        },
        sg_success: {
          50: "#C0E5D9",
          100: "#6BC2A5",
          200: "#2CA87F",
          300: "#21976C",
          400: "#107D4F",
        },
        sg_info: {
          50: "#C5EFF3",
          100: "#78D9E2",
          200: "#3EC9D6",
          300: "#30BCCC",
          400: "#1BA9BC",
        },
        sg_list: {
          bg: "rgba(9, 109, 217, 0.1)",
          border: "#1890FF",
        }
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        nunito: ["NunitoSans", "sans-serif"],
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
      },
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-down": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "fade-out-down": "fade-out-down 0.5s ease-in",
      },
    },
  },
  plugins: [],
  coreplugins: {
    preflight: false,
  },
};
