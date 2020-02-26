package am.ik.lab.syaberu;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import java.net.URI;

@ConfigurationProperties(prefix = "syaberu")
public class SyaberuProps {
    private final URI proxyUri;
    private final String proxySubscriptionId;

    @ConstructorBinding
    public SyaberuProps(URI proxyUri, String proxySubscriptionId) {
        this.proxyUri = proxyUri;
        this.proxySubscriptionId = proxySubscriptionId;
    }

    public URI getProxyUri() {
        return proxyUri;
    }

    public String getProxySubscriptionId() {
        return proxySubscriptionId;
    }
}
