/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.opencloudengine.flamingo2.engine.hawq.externaltable;

import org.opencloudengine.flamingo2.util.StringUtils;

/**
 * HAWQ External Table Format : CUSTOM.
 *
 * @author Ha Neul, Kim
 * @since 2.0
 */
public class Custom extends Format {

    private String formatter;

    public String getFormatter() {
        return formatter;
    }

    public void setFormatter(String formatter) {
        this.formatter = formatter;
    }

    @Override
    public String toString() {
        return "Custom{" +
                "type=" + this.getType() +
                ", formatter=" + formatter +
                '}';
    }

    @Override
    public boolean isEmptyOptions() {
        return StringUtils.isEmpty(this.formatter);
    }

    @Override
    public String getFormatString() {
        String formatString = "";

        if (!StringUtils.isEmpty(this.formatter)) {
            formatString += "FORMATTER = '" + this.formatter + "'";
        }

        return formatString;
    }
}