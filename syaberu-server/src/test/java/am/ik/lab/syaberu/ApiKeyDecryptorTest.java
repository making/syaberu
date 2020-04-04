package am.ik.lab.syaberu;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.encrypt.Encryptors;

import static org.assertj.core.api.Assertions.assertThat;

class ApiKeyDecryptorTest {
    @Test
    void decrypt() {
        final EncryptionConfig config = new EncryptionConfig();
        final String password = "opensesami";
        final String salt = "cafebabe";
        config.setPassword(password);
        config.setSalt(salt);

        final ApiKeyDecryptor decryptor = new ApiKeyDecryptor(config);
        final String encrypted = Encryptors.delux(password, salt).encrypt("hoge");
        final String decrypted = decryptor.decrypt(ApiKeyDecryptor.PREFIX + encrypted);
        assertThat(decrypted).isEqualTo("hoge");
    }

    @Test
    void decryptNoOps() {
        final EncryptionConfig config = new EncryptionConfig();
        final String password = "opensesami";
        final String salt = "cafebabe";
        config.setPassword(password);
        config.setSalt(salt);

        final ApiKeyDecryptor decryptor = new ApiKeyDecryptor(config);
        final String decrypted = decryptor.decrypt("hoge");
        assertThat(decrypted).isEqualTo("hoge");
    }
}