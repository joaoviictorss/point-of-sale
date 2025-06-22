import { comparePassword, hasheAndSaltPassword } from "./password";
import { createErrorResponse, createSuccessResponse } from "./http";
import {
  isTokenExpired,
  verifyToken,
  getRecentResetRequests,
  createResetToken,
  findResetToken,
  updateResetPasswordToken,
} from "./reset-password";
import {
  findUserByCredentials,
  findUserByEmail,
  updateUserPassword,
} from "./user";
import { requestPasswordReset } from "./send-password-reset-email";
import { OAuthClient, getOAuthClient } from "./oAuth";

export {
  comparePassword,
  hasheAndSaltPassword,
  verifyToken,
  isTokenExpired,
  createErrorResponse,
  createSuccessResponse,
  getRecentResetRequests,
  createResetToken,
  findResetToken,
  updateResetPasswordToken,
  findUserByCredentials,
  findUserByEmail,
  updateUserPassword,
  requestPasswordReset,
  getOAuthClient,
  OAuthClient,
};
