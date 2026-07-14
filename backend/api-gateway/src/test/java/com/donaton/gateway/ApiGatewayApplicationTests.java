package com.donaton.gateway;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.web.filter.CorsFilter;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ApiGatewayApplicationTests {

	@Autowired
	private CorsFilter corsFilter;

	@Autowired
	private Environment environment;

	@Test
	void contextLoads() {
		assertThat(corsFilter).isNotNull();
	}

	@Test
	void shouldLoadGatewayApplicationName() {
		assertThat(
				environment.getProperty("spring.application.name")
		).isEqualTo("api-gateway");
	}

	@Test
	void shouldLoadGatewayPort() {
		assertThat(
				environment.getProperty("server.port")
		).isEqualTo("8090");
	}

	@Test
	void shouldLoadBffRouteId() {
		assertThat(
				environment.getProperty(
						"spring.cloud.gateway.server.webmvc.routes[0].id"
				)
		).isEqualTo("bff");
	}

	@Test
	void shouldLoadBffRouteUri() {
		assertThat(
				environment.getProperty(
						"spring.cloud.gateway.server.webmvc.routes[0].uri"
				)
		).isEqualTo("http://bff:8080");
	}

	@Test
	void shouldLoadApiPathPredicate() {
		assertThat(
				environment.getProperty(
						"spring.cloud.gateway.server.webmvc.routes[0].predicates[0]"
				)
		).isEqualTo("Path=/api/**");
	}
}