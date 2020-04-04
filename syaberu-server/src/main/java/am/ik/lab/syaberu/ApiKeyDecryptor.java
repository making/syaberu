package am.ik.lab.syaberu;

import org.springframework.stereotype.Component;

@Component
public class ApiKeyDecryptor {
    public static final String PREFIX = "ENC:";
    private final EncryptionConfig config;

    public ApiKeyDecryptor(EncryptionConfig config) {
        this.config = config;
    }

    public String decrypt(String apiKey) {
        if (!apiKey.startsWith(PREFIX)) {
            return apiKey;
        }
        String encrypted = apiKey.substring(PREFIX.length());
        return config.textEncryptor().decrypt(encrypted);
    }
}
