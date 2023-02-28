import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      contraseña: "",
      nombreusuario: ""
    },
    validationSchema: Yup.object({
      nombreusuario: Yup.string()
        .min(8, "nombre de usuario de 8 caracteres como mínimo")
        .required("el nombre de usuario es obligatorio"),
      contraseña: Yup.string()
        .min(8, "contraseña de 8 caracteres como mínim")
        .required("la contraseña es obligatorio")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      console.log("asdasdasdasd");
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Sesión iniciada con éxito");
      }

      if (err) setErrorMessage(err.message);
    }
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="nombreusuario"
          name="nombreusuario"
          fullWidth
          value={signinForm.values.nombreusuario}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.nombreusuario && signinForm.errors.nombreusuario !== undefined}
          helperText={signinForm.touched.nombreusuario && signinForm.errors.nombreusuario}
        />
        <TextField
          type="contraseña"
          placeholder="contraseña"
          name="contraseña"
          fullWidth
          value={signinForm.values.contraseña}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.contraseña && signinForm.errors.contraseña !== undefined}
          helperText={signinForm.touched.contraseña && signinForm.errors.contraseña}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        sign in
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        sign up
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;