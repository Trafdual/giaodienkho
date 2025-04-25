import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import images from "../../assets/images";
import { Image as ImageLogin } from "../../components/ImageLogin";
import { publicRoutes } from "../../router";
import { LogoSwitcher as LogoSwitcherLogin } from "../../components/SwitchImageLogin";
import { useToast } from "../../components/GlobalStyles/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Birthday } from "~/components/Birthday";
import { getApiUrl } from "../../api/api";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [namereg, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [birthday, setBirthday] = useState();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    let valid = true;

    if (!email) {
      setEmailError("Vui lòng nhập email.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!namereg) {
      setNameError("Vui lòng nhập họ tên.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!phone) {
      setPhoneError("Vui lòng nhập số điện thoại.");
      valid = false;
    } else {
      setPhoneError("");
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleRegister = async () => {
    if (validateInputs()) {
      setIsLoading(true);
      try {
        const response = await fetch(`${getApiUrl("domain")}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: namereg,
            email: email,
            phone: phone,
            password: password,
            birthday,
          }),
        });

        const data = await response.json();

        if (data.data) {
          navigate(publicRoutes[0].path);
          showToast("Đăng ký thành công!");
        } else {
          showToast(data.message, "error");
        }
      } catch (error) {
        showToast(
          "Đã xảy ra lỗi khi gửi yêu cầu đăng ký. Vui lòng thử lại.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  console.log(birthday);

  return (
    <div className="container">
      <div className="dualscreen1">
        <ImageLogin />
      </div>
      <div className="dualscreen2">
        <div className="divlogin">
          <h1>Đăng Kí Tài Khoản</h1>
          <div className="divemail">
            <div className="divemail1">
              <input
                className={`email ${nameError ? "input-error" : ""}`}
                placeholder=" "
                value={namereg}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="label">Họ và tên</label>
            </div>
            {nameError && <div className="error">{nameError}</div>}
          </div>
          <div className="divemail">
            <div className="divemail1">
              <input
                className={`email ${emailError ? "input-error" : ""}`}
                placeholder=" "
                value={email}
                onChange={(e) => {
                  const input = e.target.value.replace(/\s/g, "");
                  setEmail(input);
                }}
              />
              <label className="label">Email</label>
            </div>
            {emailError && <div className="error">{emailError}</div>}
          </div>
          <div className="divemail">
            <div className="divemail1">
              <input
                className={`email ${phoneError ? "input-error" : ""}`}
                placeholder=" "
                value={phone}
                onChange={(e) => {
                  const input = e.target.value.replace(/\s/g, "");
                  setPhone(input);
                }}
              />
              <label className="label">Số điện thoại</label>
            </div>
            {phoneError && <div className="error">{phoneError}</div>}
          </div>
          <div className="divngaythangnam">
            <label htmlFor="">Ngày/tháng/năm sinh</label>
            <Birthday setBirthday={setBirthday} />
          </div>
          <div className="divpassword">
            <div className="divippass">
              <input
                className={`password ${passwordError ? "input-error" : ""}`}
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => {
                  const input = e.target.value.replace(/\s/g, "");
                  setPassword(input);
                }}
                onFocus={() => setIsIconVisible(true)}
              />
              <label className="label">Password</label>
              {isIconVisible && (
                <button className="eye" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              )}
            </div>
            {passwordError && <div className="error">{passwordError}</div>}
          </div>
          <button
            className="btnLogin"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? <div className="loading-spinner"></div> : "Đăng ký"}
          </button>
          <div className="divcachkhac">
            <button className="btnfacebook">
              <img src={images.facebook} alt="" className="facebook" />
            </button>
            <button className="btngoogle">
              <img src={images.google} alt="" className="google" />
            </button>
          </div>
          <div className="divRegister">
            <h3 className="register1">Bạn đã có tài khoản?</h3>
            <h3 className="register" onClick={() => navigate("/")}>
              Đăng nhập
            </h3>
          </div>
          <div>
            <LogoSwitcherLogin />
          </div>
          <div className="chinhsach">
            <h4>
              TRANG WEB NÀY ĐƯỢC BẢO MẬT BỞI HCAPTCHA VÀ TUÂN THỦ THEO{" "}
              <a href="https://www.hcaptcha.com/privacy">
                CHÍNH SÁCH QUYỀN RIÊNG TƯ
              </a>{" "}
              VÀ{" "}
              <a href="https://www.hcaptcha.com/terms">
                ĐIỀU KHOẢN DỊCH VỤ CỦA HCAPTCHA
              </a>{" "}
              .
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
