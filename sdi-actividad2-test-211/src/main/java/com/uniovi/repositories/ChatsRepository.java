package com.uniovi.repositories;

import com.uniovi.entities.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatsRepository extends MongoRepository<Chat, String> {

}
