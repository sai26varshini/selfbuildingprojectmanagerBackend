package com.example.service;

import com.example.model.IceCream;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MainService {

    public List<IceCream> getAllIceCreams() {
        List<IceCream> iceCreams = new ArrayList<>();
        iceCreams.add(new IceCream("Chocolate", 10.99));
        iceCreams.add(new IceCream("Vanilla", 9.99));
        iceCreams.add(new IceCream("Strawberry", 11.99));
        return iceCreams;
    }

    public IceCream getIceCreamById(int id) {
        // Implement logic to retrieve ice cream by id
        return new IceCream("Chocolate", 10.99);
    }

    public IceCream createIceCream(IceCream iceCream) {
        // Implement logic to create a new ice cream
        return iceCream;
    }

    public void updateIceCream(IceCream iceCream) {
        // Implement logic to update an existing ice cream
    }

    public void deleteIceCream(int id) {
        // Implement logic to delete an ice cream by id
    }
}
