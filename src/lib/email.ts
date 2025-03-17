
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  // Log the reset link to console for local development
  console.log('\n=== Password Reset Link ===')
  console.log(`Email: ${email}`)
  console.log(`Reset URL: ${resetUrl}`)
  console.log('========================\n')
}