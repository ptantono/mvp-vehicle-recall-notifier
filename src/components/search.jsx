import React from "react";
import { makeStyles } from "@material-ui/core/styles";
//import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";

import PropTypes from "prop-types";
import MaskedInput from "react-text-mask";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
const axios = require("axios");

const useStyles = makeStyles(theme => ({
  container: {
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
}));

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
};

export default function SearchBar() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    multiline: "",
    textmask: "(   )    -    "
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    //alert(values.multiline);
    // Parse multiline and check whether it is a VIN# or Year,Make,Model
    var vin = "",
      yrmakemodel = "",
      yr,
      make,
      model,
      endpoint = "",
      toPhone = "";
    var inputData = values.multiline.split("\n");
    inputData[0].length === 17
      ? (vin = inputData[0])
      : (yrmakemodel = inputData[0]);
    [yr, make, model] = yrmakemodel.split(",");
    endpoint = `/${yr}/${make}/${model}`;
    toPhone = "+1" + values.textmask.replace(/\D+/g, "");

    axios
      .post("/vehicle", {
        year: yr,
        make: make,
        model: model,
        toPhone: toPhone
      })
      .then(res => {
        console.log("RESULTS => ", res);
      })
      .catch(err => console.log("ERROR on get Request to NHTSA API", err));
  };

  return (
    <div>
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="filled-textarea"
            label="Vehicle - Recall Notifier"
            placeholder="Enter a VIN# or Year,Make,Model"
            multiline
            className={classes.textField}
            margin="normal"
            variant="filled"
            width="auto"
            onChange={handleChange("multiline")}
          />
        </form>
      </div>
      <div>
        {" "}
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="formatted-text-mask-input">
            Phone Number
          </InputLabel>
          <Input
            value={values.textmask}
            onChange={handleChange("textmask")}
            id="formatted-text-mask-input"
            width="auto"
            align="center"
            inputComponent={TextMaskCustom}
          />
        </FormControl>
      </div>
      <div>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className={classes.button}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
      </div>
    </div>
  );
}
