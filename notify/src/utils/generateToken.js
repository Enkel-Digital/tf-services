/**
 * Generate a JWT with custom claims
 */
module.exports = async function generateToken(customClaims) {
  return createToken({
    // ,
    custom: customClaims,
  });
};
