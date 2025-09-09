"use client";

// React Imports
import type { FormEvent } from "react";
import { useState } from "react";

// MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";

// Third-party Imports
import classnames from "classnames";

// Type Imports
import type { SystemMode } from "@core/types";

// Component Imports
import Link from "@components/Link";
import Logo from "@components/layout/shared/Logo";
import CustomTextField from "@core/components/mui/TextField";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Hook Imports
import { useImageVariant } from "@core/hooks/useImageVariant";
import { useSettings } from "@core/hooks/useSettings";
import { requestLogin } from "@/client/auth";
import validateEmail from "@/@core/utils/validateEmail";

// Styled Custom Components
const LoginIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  blockSize: "auto",
  maxBlockSize: 680,
  maxInlineSize: "100%",
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down("lg")]: {
    maxBlockSize: 450
  }
}));

const MaskImg = styled("img")({
  blockSize: "auto",
  maxBlockSize: 355,
  inlineSize: "100%",
  position: "absolute",
  insetBlockEnd: 0,
  zIndex: -1
});

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Vars
  const darkImg = "/images/pages/auth-mask-dark.png";
  const lightImg = "/images/pages/auth-mask-light.png";
  const darkIllustration = "/images/illustrations/auth/v2-login-dark.png";
  const lightIllustration = "/images/illustrations/auth/v2-login-light.png";
  const borderedDarkIllustration = "/images/illustrations/auth/v2-login-dark-border.png";
  const borderedLightIllustration = "/images/illustrations/auth/v2-login-light-border.png";

  const [errorText, setErrorText] = useState<string | null>(null);

  const { settings } = useSettings();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));
  const authBackground = useImageVariant(mode, lightImg, darkImg);

  // loading
  const [loading, setLoading] = useState(false);

  // form
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: ""
  });

  const setFormDataWithValidate = (newData: { email: string; password: string }) => {
    setFormData(newData);

    if (newData.email && !validateEmail(newData.email)) {
      setFormHelperText({ ...formHelperText, email: "Invalid email format" });
    } else {
      setFormHelperText({ ...formHelperText, email: null });
    }
  };

  // helper text
  const [formHelperText, setFormHelperText] = useState<{ email: string | null; password: string | null }>({
    email: null,
    password: null
  });

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  );

  const handleClickShowPassword = async () => setIsPasswordShown((show) => !show);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFormHelperText({
        email: formData.email ? null : "Email is required",
        password: formData.password ? null : "Password is required"
      });

      return;
    }

    setLoading(true);

    try {
      await requestLogin({ email: formData.email, password: formData.password });
      setTimeout(() => {
        location.href = "/";
      }, 100);
    } catch (error) {
      setErrorText("Invalid username or password");
    }

    setLoading(false);
  };

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          "flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden",
          {
            "border-ie": settings.skin === "bordered"
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ "scale-x-[-1]": theme.direction === "rtl" })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
            <Typography className='text-center' color={"red"} variant='body1'>
              {errorText}
            </Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={onSubmit} className='flex flex-col gap-5'>
            <CustomTextField
              required
              autoFocus
              fullWidth
              label='Email or Username'
              placeholder='Enter your email or username'
              value={formData.email}
              onChange={(e) => setFormDataWithValidate({ ...formData, email: e.target.value })}
              helperText={
                <Typography variant='overline' color='error'>
                  {formHelperText.email ?? ""}
                </Typography>
              }
            />
            <CustomTextField
              fullWidth
              label='Password'
              required
              placeholder='············'
              id='outlined-adornment-password'
              type={isPasswordShown ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormDataWithValidate({ ...formData, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={(e) => e.preventDefault()}>
                      <i className={isPasswordShown ? "tabler-eye-off" : "tabler-eye"} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText={
                <Typography variant='overline' color='error'>
                  {formHelperText.password ?? ""}
                </Typography>
              }
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label='Remember me' />
              <Typography className='text-end' color='primary' component={Link}>
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} color='primary'>
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginV2;
