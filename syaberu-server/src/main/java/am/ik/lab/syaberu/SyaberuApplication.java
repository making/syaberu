package am.ik.lab.syaberu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SyaberuApplication {

    public static void main(String[] args) {
        SpringApplication.run(SyaberuApplication.class, args);
    }

}
