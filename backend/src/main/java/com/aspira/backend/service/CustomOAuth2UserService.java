package com.aspira.backend.service;

import com.aspira.backend.model.User;
import com.aspira.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String provider = userRequest.getClientRegistration().getRegistrationId();
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(provider)) {
                throw new OAuth2AuthenticationException("Email already registered with different provider");
            }
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProvider(provider);
            user.setUsername(email.split("@")[0]);
            userRepository.save(user);
        }
        
        return oAuth2User;
    }
} 