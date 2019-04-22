package com.uniovi.services;

import com.uniovi.entities.User;
import com.uniovi.repositories.UsersRepository;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class UsersService {
	private final UsersRepository usersRepository;

	@Autowired
	public UsersService(UsersRepository usersRepository) {
		this.usersRepository = usersRepository;
	}

	public void deleteAll() {
		usersRepository.deleteAll();
	}

	void addAll(Iterable<User> usersList) {
		usersRepository.saveAll(usersList);
	}

	void encryptPassword(User user) {
		try {
			String key = "javi";
			String message = user.getPassword();

			Mac hasher = Mac.getInstance("HmacSHA256");
			hasher.init(new SecretKeySpec(key.getBytes(), "HmacSHA256"));

			byte[] hash = hasher.doFinal(message.getBytes());

			// to lowercase hexits
			user.setPassword(DatatypeConverter.printHexBinary(hash).toLowerCase());
		} catch(NoSuchAlgorithmException | InvalidKeyException ignored) {
		}

	}
}
