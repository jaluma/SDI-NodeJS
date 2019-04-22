package com.uniovi.repositories;

import com.uniovi.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UsersRepository extends MongoRepository<User, String> {

}