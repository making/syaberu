package am.ik.lab.syaberu;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("no-rsocket-subscriber")
class SyaberuApplicationTests {

    @Test
    void contextLoads() {
    }

}
