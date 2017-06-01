import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="First Name"
          name="firstName"
          errorText={errors.firstName}
          onChange={onChange}
          value={user.firstName}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Last Name"
          name="lastName"
          errorText={errors.lastName}
          onChange={onChange}
          value={user.lastName}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Role"
          name="role"
          errorText={errors.role}
          onChange={onChange}
          value={user.role}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="D.O.B."
          name="dob"
          errorText={errors.dob}
          onChange={onChange}
          value={user.dob}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Address Line 1"
          name="line1"
          errorText={errors.line1}
          onChange={onChange}
          value={user.line1}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Address Line 2"
          name="line2"
          errorText={errors.line2}
          onChange={onChange}
          value={user.line2}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Suburb"
          name="suburb"
          errorText={errors.suburb}
          onChange={onChange}
          value={user.suburb}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="State"
          name="state"
          errorText={errors.state}
          onChange={onChange}
          value={user.state}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Post Code"
          name="pcode"
          errorText={errors.pcode}
          onChange={onChange}
          value={user.pcode}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Description"
          name="description"
          errorText={errors.description}
          onChange={onChange}
          value={user.description}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Create New Account" primary />
      </div>

      <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
    </form>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
