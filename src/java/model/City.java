package hibernate;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author Dini
 */
@Entity
@Table(name = "city")
public class City implements Serializable {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "name", length = 45, nullable = false)
    private String name;

    public City() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
