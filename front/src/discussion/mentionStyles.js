const mentionStyles = {
  control: {
    backgroundColor: "#fff !important",
    fontSize: "14px !important",
    fontWeight: "normal !important",
  },

  "&multiLine": {
    control: {
      fontFamily: "monospace !important",
      minHeight: "63px !important",
    },
    highlighter: {
      padding: "9px !important",
      border: "1px solid transparent !important",
    },
    input: {
      padding: "9px !important",
      border: "1px solid silver !important",
    },
  },

  "&singleLine": {
    display: "inline-block !important",
    width: "180px !important",

    highlighter: {
      padding: "1px !important",
      border: "2px inset transparent !important",
    },
    input: {
      padding: "1px !important",
      border: "2px inset !important",
    },
  },

  suggestions: {
    list: {
      backgroundColor: "#2d2d2d !important", // Tamnosiva pozadina
      border: "1px solid rgba(255,255,255,0.15) !important",
      fontSize: "14px !important",
      color: "white !important", // Bela slova
    },
    item: {
      padding: "5px 15px !important",
      borderBottom: "1px solid rgba(255,255,255,0.15) !important",
      color: "white !important", // Bela slova za stavke
      "&focused": {
        backgroundColor: "#444444 !important", // Svetlija tamnosiva kad je fokusirano
        color: "white !important",
      },
    },
  },
};

export default mentionStyles;
