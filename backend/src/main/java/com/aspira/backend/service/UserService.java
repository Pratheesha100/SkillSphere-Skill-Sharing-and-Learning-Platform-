package com.aspira.backend.service;

import com.aspira.backend.dto.UserDTO;
import com.aspira.backend.exception.ResourceNotFoundException;
import com.aspira.backend.model.User;
import com.aspira.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    // Create a new user
    // Check if the username or email already exists before creating a new user
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setName(userDTO.getName() != null ? userDTO.getName() : userDTO.getUsername());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setOccupation(userDTO.getOccupation());
        user.setBirthday(userDTO.getBirthday());

        String provider = (userDTO.getProvider() == null || userDTO.getProvider().isBlank()) ? "local"
                : userDTO.getProvider();
        user.setProvider(provider);

        if ("local".equalsIgnoreCase(provider)) {
            if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
                throw new IllegalArgumentException("Password is required for local users");
            }
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        } else {
            user.setPasswordHash(null);
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    // This method retrieves a user by their ID and converts it to a UserDTO
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return convertToDTO(user);
    }

    // Get user by username
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    // Update user details
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        existingUser.setName(userDTO.getName());
        existingUser.setOccupation(userDTO.getOccupation());
        existingUser.setBirthday(userDTO.getBirthday());

        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }

    @Transactional
    // Delete user by ID
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    // Update user profile details (name, occupation, birthday)
    public UserDTO updateUserProfile(Long userId, UserDTO userDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Only update profile-specific fields
        if (userDTO.getName() != null) {
            existingUser.setName(userDTO.getName());
        }
        if (userDTO.getOccupation() != null) {
            existingUser.setOccupation(userDTO.getOccupation());
        }
        if (userDTO.getBirthday() != null) {
            existingUser.setBirthday(userDTO.getBirthday());
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }

    // Authenticate user with email and password
    public UserDTO authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return convertToDTO(user);
    }

    // Convert User entity to UserDTO
    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setName(user.getName());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setOccupation(user.getOccupation());
        userDTO.setBirthday(user.getBirthday());
        return userDTO;
    }
}
