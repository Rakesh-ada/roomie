package com.example.roomie.ui.theme

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.material3.ExposedDropdownMenuDefaults.outlinedTextFieldColors
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.roomie.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen() {

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFFE3F2FD),
                        Color(0xFFFFFFFF)
                    )
                )
            )
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Spacer(modifier = Modifier.height(80.dp))

            // Logo
            Icon(
                painter = painterResource(id = R.drawable.ic_logo),
                contentDescription = "Logo",
                modifier = Modifier.size(90.dp),
                tint = Color.Unspecified
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Roomie",
                style = MaterialTheme.typography.headlineLarge,
                color = Color(0xFF0D47A1)
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Find your perfect roommate",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(36.dp))

            // Card Form
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.large,
                tonalElevation = 6.dp,
                shadowElevation = 8.dp,
                color = Color.White
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {

                    // Email
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = MaterialTheme.shapes.medium,
                        colors = outlinedTextFieldColors(
                            focusedBorderColor = Color(0xFF1976D2),
                            cursorColor = Color(0xFF1976D2)
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Password
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password") },
                        singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password
                        ),
                        modifier = Modifier.fillMaxWidth(),
                        shape = MaterialTheme.shapes.medium,
                        colors = outlinedTextFieldColors(
                            focusedBorderColor = Color(0xFF1976D2),
                            cursorColor = Color(0xFF1976D2)
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Forgot Password?",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF1976D2),
                        modifier = Modifier
                            .align(Alignment.End)
                            .clickable { }
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    // Login Button
                    Button(
                        onClick = {
                            if (email.isEmpty() || password.isEmpty()) {
                                Toast.makeText(
                                    context,
                                    "Please fill all fields",
                                    Toast.LENGTH_SHORT
                                ).show()
                                return@Button

                            }
                            if (password.length < 6) {
                                Toast.makeText(
                                    context,
                                    "Password must be at least 6 characters",
                                    Toast.LENGTH_SHORT
                                ).show()
                                return@Button
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = MaterialTheme.shapes.medium
                    ) {
                        Text("Login")
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row {
                Text(
                    text = "Don't have an account? ",
                    color = Color.Gray
                )
                Text(
                    text = "Sign up",
                    color = Color(0xFF1976D2),
                    modifier = Modifier.clickable { }
                )
            }

            Spacer(modifier = Modifier.height(40.dp))
        }
    }
}

@Preview(
    showBackground = true,
    showSystemUi = true,
    name = "Login Screen Preview",
    device = "spec:width=411dp,height=891dp,dpi=420"
)
@Composable
fun LoginScreenPreview() {
    MaterialTheme {
        LoginScreen()
    }
}