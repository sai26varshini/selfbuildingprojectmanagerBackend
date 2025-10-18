package com.example.repository;

import com.example.model.IceCream;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MainRepository extends CrudRepository<IceCream, Long> {

    List<IceCream> findByName(String name);

    List<IceCream> findByFlavor(String flavor);

}
